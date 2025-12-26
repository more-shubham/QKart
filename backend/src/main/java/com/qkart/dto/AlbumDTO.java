package com.qkart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDTO {
    private Long id;
    private String title;
    private String artist;
    private String imageUrl;
    private Integer releaseYear;
    private String genre;
    private Integer likes;
    private Double rating;
    private Boolean isFeatured;
    private List<SongDTO> songs;
}
