import {WebSocketStatus} from "~/constants/WebSocketStatus";
import type {AnswerResource, TaskResource} from "~/resource/game";
import {WsAnswers} from "~/resource/game";
import type {Ref} from "vue";
import type {ResultResource} from "~/resource/result";
import {useWsPath} from "~/config/entrypoint";

export default defineNuxtPlugin(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let shouldReconnect = true;
    let eventListeners: ((data: any) => void)[] = [];

    const opponentTyping = ref(false);

    const lobbyUuid: Ref<String | null> = ref(null)
    const wsStatus = ref<WebSocketStatus>(WebSocketStatus.DISCONNECTED);
    const wsUsers = ref([]);
    const wsTask: Ref<TaskResource | null> = ref(null);
    const wsAnswers: Ref<AnswerResource | null> = ref([]);
    const wsWinner = ref(null);
    const wsEndAt: number | null = ref(null)
    const wsNowAt: number | null = ref(null)
    const wsResult: ResultResource[] | null = ref(null);
    const wsMessage: string | null = ref(null);
    const wsPrompt: string | null = ref(null);

    const {user, clear} = useCurrentUser()
    const profileStore = useProfileStore();
    const trackedStatuses = new Set([
        WsAnswers.GAME_SEARCH,
        WsAnswers.GAME_START,
        WsAnswers.GAME_END,
        WsAnswers.GAME_GENERATE_TASK,
        WsAnswers.GAME_GENERATE_RESULT,
        WsAnswers.GAME_JOINED,
        WsAnswers.GAME_ERROR,
        WsAnswers.GAME_READY,
        WsAnswers.GAME_USER_JOINED,
    ])

    const clearWs = () => {
        lobbyUuid.value = null;
        wsUsers.value = [];
        wsAnswers.value = [];
        wsTask.value = null;
        wsWinner.value = null;
        wsResult.value = null;
        wsEndAt.value = null;
        wsNowAt.value = null;
        wsMessage.value = null;
        eventListeners = [];
    }
    const isValidWsAnswer = (value: any): value is WsAnswers => {
        const num = Number(value);
        return Object.values(WsAnswers)
            .filter(v => typeof v === 'number')
            .includes(num);
    }

    const findGame = () => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({type: "findGame"}));
        } else {
            shouldReconnect = false;

            wsStatus.value = WebSocketStatus.DISCONNECTED;

            const onceReady = () => {
                socket?.removeEventListener("open", onceReady);
                socket?.send(JSON.stringify({type: "findGame"}));
            };

            connect(false);
            socket?.addEventListener("open", onceReady);
            console.warn("⚠️ WebSocket не подключен, поиск лобби невозможен");
        }
    }
    const ensureConnectedAndFindGame = () => {
        if (wsStatus.value === WebSocketStatus.DISCONNECTED) {
            connect(false);

            const interval = setInterval(() => {
                if (wsStatus.value === WebSocketStatus.CONNECTED) {
                    clearInterval(interval);
                    findGame();
                }
            }, 100);
        } else {
            findGame();
        }
    }

    const connect = (checkLobby = true) => {
        if (wsStatus.value === WebSocketStatus.CONNECTED || wsStatus.value === WebSocketStatus.CONNECTING) {
            return;
        }

        console.log("🔌 Подключение к WebSocket...");

        wsStatus.value = WebSocketStatus.CONNECTING;

        const {token, clear: clearToken} = useToken();

        const wsUrl = `${useWsPath()}?token=${encodeURIComponent(token.value || "")}`;

        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("✅ WebSocket подключен");
            wsStatus.value = WebSocketStatus.CONNECTED;
        };

        socket.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);

                console.log("📩 Game WebSocket сообщение:", data);

                if (data.status === WsAnswers.WS_READY && checkLobby) {
                    socket.send(JSON.stringify({ type: 'reconnectToLobby' }));
                    return;
                }

                if (data.code == 401 && data.refresh) {
                    await profileStore.refreshToken()
                }

                if (data.code == 401 && !data.refresh) {
                    lobbyUuid.value = null;
                    shouldReconnect = false
                    clear();
                    clearToken();
                    wsStatus.value = WebSocketStatus.DISCONNECTED;
                    socket?.close()
                    navigateTo('/auth');
                    return;
                }

                if (data.status != null && isValidWsAnswer(data.status)) {
                    if (trackedStatuses.has(data.status)) {
                        wsStatus.value = data.status;
                    }
                    if (wsStatus.value == WsAnswers.GAME_SEARCH) {
                        clearWs()
                    }
                }

                if (data.status === WsAnswers.GAME_TYPING) {
                    const isOpponent = data.userId !== user.value?.id;

                    if (isOpponent && typeof data.isTyping === "boolean") {
                        opponentTyping.value = data.isTyping;
                    }
                }

                if (data.status === WsAnswers.GAME_LOBBY_NOT_FOUND){
                    shouldReconnect = false;
                    clearWs()
                    wsStatus.value = WebSocketStatus.DISCONNECTED;
                    socket?.close()
                }

                if (data.endAt) {
                    wsEndAt.value = data.endAt;
                }

                if (data.prompt) {
                    wsPrompt.value = data.prompt;
                }

                if (data.nowAt) {
                    wsNowAt.value = data.nowAt;
                }

                if (data.lobbyUuid) {
                    lobbyUuid.value = data.lobbyUuid;
                }

                if (data.users) {
                    wsUsers.value = data.users;
                }

                if (data.task) {
                    wsTask.value = data.task;
                }

                if (data.answers) {
                    wsAnswers.value = data.answers;
                }

                if (data.winner) {
                    wsWinner.value = data.winner;
                }

                if (data.result) {
                    wsResult.value = data.result;
                }

                if (data.status == WsAnswers.GAME_USER_JOINED && data.newPlayer) {
                    wsUsers.value.push(data.newPlayer)
                }

                if (data.status == WsAnswers.GAME_NEW_ANSWER && data.answer) {
                    wsAnswers.value.push(data.answer)
                }

                if (data.status == WsAnswers.GAME_ERROR && data.message) {
                    wsMessage.value = data.message;
                }

                eventListeners.forEach(callback => callback(data));
            } catch (error) {
                shouldReconnect = false;
                socket?.close();
                clearWs();
                wsStatus.value = WebSocketStatus.DISCONNECTED;
                console.error("❌ Ошибка обработки сообщения:", error);
            }
        };

        socket.onclose = () => {
            console.log('❌ WebSocket close')
            if (shouldReconnect) {
                console.warn("⚠️ WebSocket отключен. Переподключение через 3 секунды...");
                reconnectTimeout = setTimeout(connect, 3000);
            } else {
                wsStatus.value = WebSocketStatus.DISCONNECTED;
                clearWs()
            }
        };

        socket.onerror = (error) => {
            clearWs()
            wsStatus.value = WebSocketStatus.DISCONNECTED;
            console.error("❌ Ошибка WebSocket:", error);
        };
    };

    return {
        provide: {
            gameWs: {
                send: (message: any) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify(message));
                    } else {
                        console.warn("⚠️ WebSocket не подключен, сообщение не отправлено");
                    }
                },
                findGame,
                ensureConnectedAndFindGame,
                connect,
                sendAnswer: (answer: string) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        if (wsAnswers.value.find((item) => item.userId == user.value.id)) {
                            return;
                        }
                        wsAnswers.value.push({userId: user.value.id, answer: answer})
                        socket.send(JSON.stringify({type: "answer", lobbyUuid: lobbyUuid.value, answer}));
                    } else {
                        console.warn("⚠️ WebSocket не подключен, ответ не отправлен");
                    }
                },
                leaveGame: () => {
                    shouldReconnect = false;
                    socket?.close();
                    clearWs();
                    wsStatus.value = WebSocketStatus.DISCONNECTED;
                },
                typing: (isTyping: boolean) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({type: "typing", isTyping}));
                    }
                },
                status: wsStatus,
                users: wsUsers,
                task: wsTask,
                answers: wsAnswers,
                winner: wsWinner,
                endAt: wsEndAt,
                nowAt: wsNowAt,
                opponentTyping,
                result: wsResult,
                message: wsMessage,
                prompt: wsPrompt
            }
        }
    };
});
