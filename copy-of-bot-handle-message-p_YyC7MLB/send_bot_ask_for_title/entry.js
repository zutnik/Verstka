import axios from "axios"

export default defineComponent({
  async run({ steps, $ }) {
    const { chat_id, message_id, isTitle } = steps.validate_title.$return_value;
    if (!isTitle) {
      await axios({
        method: "POST",
        url: "https://eo5038rsi81os93.m.pipedream.net",
        data: {
          chat_id,
          message_id,
        },
      });
    }
  },
})
