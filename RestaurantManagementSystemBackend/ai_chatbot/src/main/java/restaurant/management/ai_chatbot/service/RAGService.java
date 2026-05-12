package restaurant.management.ai_chatbot.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RAGService {

    private static final List<String> docs = List.of(
            "Chicken Biryani contains rice, chicken, spices",
            "Paneer Curry is vegetarian",
            "Today's offer: 10% discount on all items"
    );

    public String getContext(String question) {
        return docs.stream()
                .filter(d -> question.toLowerCase().contains("chicken"))
                .findFirst()
                .orElse("");
    }
}
