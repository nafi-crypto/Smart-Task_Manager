package com.taskmanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "columns")
public class Column {

    @Id
    private String id;

    private String title;
    private String boardId;

    @Builder.Default
    private List<String> cardOrder = new ArrayList<>();

    private Integer position;
    private String color;
    private boolean archived;
}
