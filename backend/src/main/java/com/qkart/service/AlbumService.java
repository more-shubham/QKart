package com.qkart.service;

import com.qkart.dto.AlbumDTO;
import com.qkart.dto.SongDTO;
import com.qkart.model.Album;
import com.qkart.model.Song;
import com.qkart.repository.AlbumRepository;
import com.qkart.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;

    public List<AlbumDTO> getAllAlbums() {
        return albumRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AlbumDTO getAlbumById(Long id) {
        return albumRepository.findById(id)
                .map(this::toDTOWithSongs)
                .orElseThrow(() -> new RuntimeException("Album not found"));
    }

    public List<AlbumDTO> getFeaturedAlbums() {
        return albumRepository.findByIsFeaturedTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlbumDTO> getTopAlbums() {
        return albumRepository.findTop10ByOrderByLikesDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlbumDTO> getAlbumsByGenre(String genre) {
        return albumRepository.findByGenre(genre).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<AlbumDTO> searchAlbums(String query) {
        return albumRepository.searchAlbums(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllGenres() {
        return albumRepository.findAllGenres();
    }

    public List<SongDTO> getSongsByAlbumId(Long albumId) {
        return songRepository.findByAlbumId(albumId).stream()
                .map(this::toSongDTO)
                .collect(Collectors.toList());
    }

    public List<SongDTO> getTopSongs() {
        return songRepository.findTop10ByOrderByPlaysDesc().stream()
                .map(this::toSongDTO)
                .collect(Collectors.toList());
    }

    public List<SongDTO> searchSongs(String query) {
        return songRepository.searchSongs(query).stream()
                .map(this::toSongDTO)
                .collect(Collectors.toList());
    }

    private AlbumDTO toDTO(Album album) {
        return AlbumDTO.builder()
                .id(album.getId())
                .title(album.getTitle())
                .artist(album.getArtist())
                .imageUrl(album.getImageUrl())
                .releaseYear(album.getReleaseYear())
                .genre(album.getGenre())
                .likes(album.getLikes())
                .rating(album.getRating())
                .isFeatured(album.getIsFeatured())
                .build();
    }

    private AlbumDTO toDTOWithSongs(Album album) {
        AlbumDTO dto = toDTO(album);
        List<SongDTO> songs = album.getSongs().stream()
                .map(this::toSongDTO)
                .collect(Collectors.toList());
        dto.setSongs(songs);
        return dto;
    }

    private SongDTO toSongDTO(Song song) {
        return SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .durationSeconds(song.getDurationSeconds())
                .audioUrl(song.getAudioUrl())
                .trackNumber(song.getTrackNumber())
                .plays(song.getPlays())
                .albumId(song.getAlbum() != null ? song.getAlbum().getId() : null)
                .albumTitle(song.getAlbum() != null ? song.getAlbum().getTitle() : null)
                .build();
    }
}
