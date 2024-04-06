using VkNet.Model;

namespace server.Models.Vk.Conversation
{
    public class Conversations(GetConversationsResult getConversationsResult, List<User> users, List<Group> groups)
    {
        public GetConversationsResult ConversationsList { get; set; } = getConversationsResult;

        public List<User> Users { get; set; } = users;
        public List<Group> Groups { get; set; } =    groups;
    }
}
