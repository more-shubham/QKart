package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongDTO {
    private Long id;
    private String title;
    private String artist;
    private Integer durationSeconds;
    private String audioUrl;
    private Integer trackNumber;
    private Integer plays;
    private Long albumId;
    private String albumTitle;
}
