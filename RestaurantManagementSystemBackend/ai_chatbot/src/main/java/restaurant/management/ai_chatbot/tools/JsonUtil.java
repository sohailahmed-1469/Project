package restaurant.management.ai_chatbot.tools;

public class JsonUtil {

    public static String extractTool(String json) {
        if(json.contains("get_menu")) return "get_menu";
        if(json.contains("get_sales")) return "get_sales";
        if(json.contains("place_order")) return "place_order";
        return "";
    }
}
