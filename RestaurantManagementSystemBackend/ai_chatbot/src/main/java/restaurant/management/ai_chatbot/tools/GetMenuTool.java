package restaurant.management.ai_chatbot.tools;

import org.springframework.stereotype.Component;

@Component
public class GetMenuTool implements Tool {

    public String getName() {
        return "get_menu";
    }

    public String execute(String input) {
        return "Menu: Biryani, Pizza, Burger";
    }
}
