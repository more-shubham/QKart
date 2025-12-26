package com.qkart.repository;

import com.qkart.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    List<Album> findByIsFeaturedTrue();

    List<Album> findByGenre(String genre);

    @Query("SELECT a FROM Album a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(a.artist) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Album> searchAlbums(@Param("query") String query);

    List<Album> findTop10ByOrderByLikesDesc();

    @Query("SELECT DISTINCT a.genre FROM Album a WHERE a.genre IS NOT NULL")
    List<String> findAllGenres();
}
