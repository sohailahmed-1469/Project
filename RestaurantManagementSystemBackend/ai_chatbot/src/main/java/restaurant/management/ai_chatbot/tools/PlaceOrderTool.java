package restaurant.management.ai_chatbot.tools;

import org.springframework.stereotype.Component;

@Component
public class PlaceOrderTool implements Tool {

    public String getName() {
        return "place_order";
    }

    public String execute(String input) {
        return "Order placed successfully for: " + input;
    }
}
