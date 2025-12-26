package com.qkart.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "albums")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String artist;

    private String imageUrl;

    private Integer releaseYear;

    private String genre;

    private Integer likes;

    private Double rating;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @OneToMany(mappedBy = "album", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Song> songs = new ArrayList<>();
}
