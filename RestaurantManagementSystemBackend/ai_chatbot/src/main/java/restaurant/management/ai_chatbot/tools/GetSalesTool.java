package restaurant.management.ai_chatbot.tools;

import org.springframework.stereotype.Component;

@Component
public class GetSalesTool implements Tool {

    public String getName() {
        return "get_sales";
    }

    public String execute(String input) {
        return "Today's sales: ₹25,000";
    }
}
