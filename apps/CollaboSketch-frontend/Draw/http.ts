const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
import axios from "axios";

export async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BASE_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });
  return shapes;
}
