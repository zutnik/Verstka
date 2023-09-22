const buildOriginalMessage = ({ message }) => {
  if (!message.reply_to_message) return message;
  const { message_id, text } = message;
  const reply_message = message.reply_to_message;
  return {
    ...reply_message,
    reply_id: message_id,
    text: reply_message.text ? reply_message.text : text,
    new_text: reply_message.text ? text : undefined,
  };
};

// NOTE: `new_text` is a custom field, it doesn't exist in the Message model
const getTitle = ({ text, caption, new_text }) => {
  const title = text || caption || '';
  return new_text
    ? `${new_text} ${title}`
    : title;
};

const getType = ({
  hasPhoto,
  hasVideo,
  hasGif,
  hasDocument,
  hasLink,
}) => {
  if (hasPhoto && hasVideo && hasGif && hasDocument && hasLink) return "Змiшане";
  // ...
  if (hasPhoto) return "G 📷";
  if (hasVideo || hasLink) return "V 🎥";
  if (hasGif) return "Без звука (Gif)";
  if (hasDocument) return "D";
  return "S 🔴";
};

const getDuration = ({ video }) => {
  if (!video) return undefined;
  const seconds = video.duration;
  return new Date(seconds * 1000)
    .toISOString()
    .substring(11, 19);
};

const checkHasLink = ({ text, entities }) => {
  if (!text || !entities || entities.length > 1) return false;
  const { offset, length, type } = entities[0];
  if (type !== 'url') return false;
  if (offset === 0 && length === text.length) return true;
  return false;
};

const checkIsTitleLink = ({ new_text, text, entities }) => {
  if (new_text) return false; // even if new_text is link it will be used as a title
  return checkHasLink({ text, entities });
};

export default defineComponent({
  async run({ steps, $ }) {
    const message = buildOriginalMessage(steps.trigger.event);
    const metadata = {
      hasPhoto: !!message.photo,
      hasVideo: !!message.video,
      hasGif: !!message.animation,
      hasDocument: !!message.document,
      hasLink: checkHasLink(message),
      // ...
    };
    return {
      title: getTitle(message),
      isTitleLink: checkIsTitleLink(message),
      chat_id: message.chat.id,
      message_id: message.message_id,
      media_group_id: message.media_group_id,
      // NOTE: `reply_id` is a custom field, it doesn't exist in the Message model
      reply_id: message.reply_id,
      duration: getDuration(message),
      type: getType(metadata),
    };
  },
});
