package com.keeper.api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class NoteDto {
    private String title;
    private String content;
}
