export default defineComponent({
  props: {
    botDataStore: {
      type: "data_store",
    },
  },
  // this function returns a boolean value
  // that determines whether the workflow
  // should continue or be aborted
  async run({ steps, $ }) {
    const { media_group_id, reply_id, title } = steps.parse_data.$return_value;
    if (!media_group_id) return true;
    // bug fix: wait until workflow with title finish its work
    // and media_group_id will be added to database
    if (!title) $.flow.delay(10000);
    const isGroupHandled = await this.botDataStore.get(media_group_id);
    if (isGroupHandled && !reply_id) return false;
    else if (isGroupHandled && reply_id) return true;
    await this.botDataStore.set(media_group_id, true);
    return true;
  },
})