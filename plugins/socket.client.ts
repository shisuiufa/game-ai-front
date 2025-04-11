import {WebSocketStatus} from "~/constants/WebSocketStatus";
import type {AnswerResource, TaskResource} from "~/resource/game";
import type {Ref} from "vue";
import type {UserResource} from "~/resource/user";
import {WsAnswers} from "~/resource/game";

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

    const user: Ref<UserResource | null> = useCurrentUser();
    const profileCookie = useCookie('profile') as Ref<{ user: UserResource | null } | undefined>;

    const profileStore = useProfileStore();

    function isValidWsAnswer(value: any): value is WsAnswers {
        const num = Number(value);
        return Object.values(WsAnswers)
            .filter(v => typeof v === 'number')
            .includes(num);
    }

    const trackedStatuses = new Set([
        WsAnswers.GAME_SEARCH,
        WsAnswers.GAME_START,
    ])

    const clearWs = () => {
        lobbyUuid.value = null;
        wsUsers.value = [];
        wsAnswers.value = [];
        wsTask.value = null;
        wsWinner.value = null;
    }

    const connect = () => {
        console.log("🔌 Подключение к WebSocket...");
        const accessToken = useCookie("accessToken");

        const wsUrl = `ws://localhost:3001?token=${encodeURIComponent(accessToken.value || "")}`;

        wsStatus.value = WebSocketStatus.CONNECTING;
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("✅ WebSocket подключен");
            wsStatus.value = WebSocketStatus.CONNECTED;
        };

        socket.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📩 Game WebSocket сообщение:", data);

                if(data.code == 401 && data.refresh){
                   await profileStore.refreshToken()
                }

                if(data.code == 401 && !data.refresh){
                    lobbyUuid.value = null;
                    shouldReconnect = false
                    user.value = null;
                    profileCookie.value = undefined;
                    accessToken.value = undefined;
                    wsStatus.value = WebSocketStatus.DISCONNECTED;
                    navigateTo('/auth');
                    return;
                }

                if (data.status != null && isValidWsAnswer(data.status)) {
                    if(trackedStatuses.has(data.status)){
                        console.log(data.status)
                        wsStatus.value = data.status;
                    }
                    if(wsStatus.value == WsAnswers.GAME_END || wsStatus.value == WsAnswers.GAME_SEARCH) {
                        clearWs()
                    }
                }

                if (data.event === WsAnswers.GAME_TYPING) {
                    const isOpponent = data.userId !== user.value?.id;

                    if (isOpponent && typeof data.isTyping === "boolean") {
                        opponentTyping.value = data.isTyping;
                    }
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

                if(data.winner){
                    wsWinner.value = data.winner;
                }

                if(data.event == WsAnswers.GAME_USER_JOINED && data.newPlayer){
                    wsUsers.value.push(data.newPlayer)
                }

                if(data.event == WsAnswers.GAME_NEW_ANSWER && data.answer){
                    wsAnswers.value.push(data.answer)
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
            if(shouldReconnect){
                console.warn("⚠️ WebSocket отключен. Переподключение через 3 секунды...");
                reconnectTimeout = setTimeout(connect, 3000);
            } else {
                clearWs()
            }
        };

        socket.onerror = (error) => {
            clearWs()
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
                findGame: () => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({type: "findGame"}));
                    } else {
                        shouldReconnect = false;

                        const onceReady = () => {
                            socket?.removeEventListener("open", onceReady);
                            socket?.send(JSON.stringify({ type: "findGame" }));
                        };

                        connect();
                        socket?.addEventListener("open", onceReady);
                        console.warn("⚠️ WebSocket не подключен, поиск лобби невозможен");
                    }
                },
                sendAnswer: (answer: string) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        if(wsAnswers.value.find((item) => item.userId == user.value.id)){
                            return;
                        }
                        wsAnswers.value.push({userId: user.value.id, answer: answer})
                        socket.send(JSON.stringify({type: "answer", lobbyUuid, answer}));
                    } else {
                        console.warn("⚠️ WebSocket не подключен, ответ не отправлен");
                    }
                },
                connect: () => {
                    connect();
                },
                leaveGame: () => {
                    shouldReconnect = false;
                    socket?.close();
                    clearWs();
                    wsStatus.value = WebSocketStatus.DISCONNECTED;
                },
                typing: (isTyping: boolean) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ type: "typing", isTyping }));
                    }
                },
                status: wsStatus,
                users: wsUsers,
                task: wsTask,
                answers: wsAnswers,
                winner: wsWinner,
                opponentTyping,
            }
        }
    };
});
