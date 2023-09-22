export default defineComponent({
  async run({ steps, $ }) {
    const { chat_id, message_id, title, isTitleLink } = steps.parse_data.$return_value;
    return {
      chat_id,
      message_id,
      isTitle: isTitleLink !== true && !!title, // it's hard to understand, I know
    };
  },
});
