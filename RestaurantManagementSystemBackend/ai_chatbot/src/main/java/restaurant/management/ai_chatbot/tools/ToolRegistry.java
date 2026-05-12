package restaurant.management.ai_chatbot.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ToolRegistry {

    private final Map<String, Tool> tools;

    @Autowired
    public ToolRegistry(List<Tool> toolList) {
        tools = toolList.stream()
                .collect(Collectors.toMap(Tool::getName, t -> t));
    }

    public boolean hasTool(String name) {
        return tools.containsKey(name);
    }

    public String execute(String name, String input) {
        return tools.get(name).execute(input);
    }

    public String getToolNames() {
        return tools.keySet().toString();
    }
}
