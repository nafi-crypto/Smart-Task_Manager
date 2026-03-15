package com.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    private String title;
    private String description;
    private String columnId;
    private String boardId;

    private Priority priority;
    private List<String> labels;
    private List<String> assigneeIds;
    private List<ChecklistItem> checklist;
    private List<Attachment> attachments;
    private List<Comment> comments;

    private LocalDateTime dueDate;
    private boolean archived;
    private Integer position;

    @Builder.Default
    private String coverColor = null;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChecklistItem {
        private String id;
        private String text;
        private boolean completed;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Attachment {
        private String id;
        private String name;
        private String url;
        private LocalDateTime uploadedAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Comment {
        private String id;
        private String text;
        private String authorId;
        private String authorName;
        private LocalDateTime createdAt;
    }
}
