package com.taskmanager.dto;

import lombok.Data;
import java.util.List;

@Data
public class BoardDTO {
    private String title;
    private String description;
    private String backgroundColor;
    private String backgroundImage;
    private String ownerId;
    private List<String> memberIds;
}
