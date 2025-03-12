import {WebSocketStatus} from "~/constants/WebSocketStatus";

export default defineNuxtPlugin(() => {
    const wsUrl = 'ws://localhost:3001';
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let eventListeners: ((data: any) => void)[] = [];

    const wsStatus = ref<WebSocketStatus>(WebSocketStatus.DISCONNECTED);

    const connect = () => {
        console.log("🔌 Подключение к WebSocket...");
        wsStatus.value = WebSocketStatus.CONNECTING;
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("✅ WebSocket подключен");
            wsStatus.value = WebSocketStatus.CONNECTED;
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📩 Game WebSocket сообщение:", data);

                switch (data.type) {
                    case "searching":
                        wsStatus.value = WebSocketStatus.SEARCHING;
                        break;
                    case "joined":
                        wsStatus.value = WebSocketStatus.JOINED;
                        break;
                    case "start":
                        wsStatus.value = WebSocketStatus.START;
                        break;
                    case "error":
                        wsStatus.value = WebSocketStatus.ERROR;
                        break;
                }

                eventListeners.forEach(callback => callback(data));
            } catch (error) {
                console.error("❌ Ошибка обработки сообщения:", error);
            }
        };

        socket.onclose = () => {
            console.warn("⚠️ WebSocket отключен. Переподключение через 3 секунды...");
            reconnectTimeout = setTimeout(connect, 3000);
        };

        socket.onerror = (error) => {
            console.error("❌ Ошибка WebSocket:", error);
        };
    };

    connect();

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
                findGame: (username: string) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                       socket.send(JSON.stringify({ type: "findGame", username }));
                    } else {
                        console.warn("⚠️ WebSocket не подключен, поиск лобби невозможен");
                    }
                },
                sendAnswer: (lobbyId: string, answer: number) => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ type: "answer", lobbyId, answer }));
                    } else {
                        console.warn("⚠️ WebSocket не подключен, ответ не отправлен");
                    }
                },
                onMessage: (callback: (data: any) => void) => {
                    eventListeners.push(callback);
                },
                status: wsStatus,
            }
        }
    };
});
