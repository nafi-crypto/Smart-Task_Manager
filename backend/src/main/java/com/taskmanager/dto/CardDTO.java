package com.taskmanager.dto;

import com.taskmanager.model.Card;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CardDTO {
    private String title;
    private String description;
    private Card.Priority priority;
    private List<String> labels;
    private List<String> assigneeIds;
    private LocalDateTime dueDate;
    private String coverColor;
    private List<Card.ChecklistItem> checklist;
}
