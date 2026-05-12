package restaurant.management.ai_chatbot.tools;

public interface Tool {
    String getName();
    String execute(String input);
}
