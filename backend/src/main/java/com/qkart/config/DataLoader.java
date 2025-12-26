package com.qkart.config;

import com.qkart.model.*;
import com.qkart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final SongRepository songRepository;

    @Override
    public void run(String... args) {
        loadProducts();
        loadUsers();
        loadAlbumsAndSongs();
    }

    private void loadProducts() {
        if (productRepository.count() > 0) return;

        List<Product> products = Arrays.asList(
            Product.builder()
                .name("iPhone 15 Pro")
                .description("Latest Apple smartphone with A17 Pro chip")
                .price(new BigDecimal("999.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/iphone/400/400")
                .stock(50)
                .rating(4.8)
                .reviewCount(1250)
                .build(),
            Product.builder()
                .name("MacBook Pro 14\"")
                .description("Powerful laptop with M3 Pro chip")
                .price(new BigDecimal("1999.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/macbook/400/400")
                .stock(30)
                .rating(4.9)
                .reviewCount(890)
                .build(),
            Product.builder()
                .name("Sony WH-1000XM5")
                .description("Premium noise-canceling wireless headphones")
                .price(new BigDecimal("349.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/headphones/400/400")
                .stock(100)
                .rating(4.7)
                .reviewCount(2340)
                .build(),
            Product.builder()
                .name("Nike Air Max 270")
                .description("Comfortable running shoes with Max Air unit")
                .price(new BigDecimal("150.00"))
                .category("Footwear")
                .imageUrl("https://picsum.photos/seed/nike/400/400")
                .stock(200)
                .rating(4.5)
                .reviewCount(3450)
                .build(),
            Product.builder()
                .name("Levi's 501 Original Jeans")
                .description("Classic straight fit jeans")
                .price(new BigDecimal("69.99"))
                .category("Clothing")
                .imageUrl("https://picsum.photos/seed/jeans/400/400")
                .stock(150)
                .rating(4.4)
                .reviewCount(1890)
                .build(),
            Product.builder()
                .name("Samsung 65\" OLED TV")
                .description("4K OLED Smart TV with HDR")
                .price(new BigDecimal("1499.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/tv/400/400")
                .stock(25)
                .rating(4.6)
                .reviewCount(567)
                .build(),
            Product.builder()
                .name("Dyson V15 Vacuum")
                .description("Cordless vacuum with laser dust detection")
                .price(new BigDecimal("749.99"))
                .category("Home")
                .imageUrl("https://picsum.photos/seed/vacuum/400/400")
                .stock(40)
                .rating(4.8)
                .reviewCount(1234)
                .build(),
            Product.builder()
                .name("Kindle Paperwhite")
                .description("E-reader with 6.8\" display and warm light")
                .price(new BigDecimal("139.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/kindle/400/400")
                .stock(80)
                .rating(4.7)
                .reviewCount(4567)
                .build(),
            Product.builder()
                .name("Instant Pot Duo")
                .description("7-in-1 Electric Pressure Cooker")
                .price(new BigDecimal("89.99"))
                .category("Home")
                .imageUrl("https://picsum.photos/seed/instantpot/400/400")
                .stock(120)
                .rating(4.6)
                .reviewCount(8901)
                .build(),
            Product.builder()
                .name("Adidas Ultraboost 23")
                .description("Premium running shoes with Boost midsole")
                .price(new BigDecimal("190.00"))
                .category("Footwear")
                .imageUrl("https://picsum.photos/seed/adidas/400/400")
                .stock(90)
                .rating(4.7)
                .reviewCount(2345)
                .build(),
            Product.builder()
                .name("The North Face Jacket")
                .description("Waterproof and breathable outdoor jacket")
                .price(new BigDecimal("299.99"))
                .category("Clothing")
                .imageUrl("https://picsum.photos/seed/jacket/400/400")
                .stock(60)
                .rating(4.5)
                .reviewCount(789)
                .build(),
            Product.builder()
                .name("Apple Watch Series 9")
                .description("Advanced smartwatch with health features")
                .price(new BigDecimal("399.99"))
                .category("Electronics")
                .imageUrl("https://picsum.photos/seed/watch/400/400")
                .stock(70)
                .rating(4.8)
                .reviewCount(3456)
                .build()
        );

        productRepository.saveAll(products);
    }

    private void loadUsers() {
        if (userRepository.count() > 0) return;

        User user = User.builder()
            .email("demo@qkart.com")
            .name("Demo User")
            .phone("+1234567890")
            .build();

        Address address = Address.builder()
            .street("123 Main Street")
            .city("San Francisco")
            .state("CA")
            .zipCode("94102")
            .country("USA")
            .isDefault(true)
            .user(user)
            .build();

        user.getAddresses().add(address);
        userRepository.save(user);
    }

    private void loadAlbumsAndSongs() {
        if (albumRepository.count() > 0) return;

        Album album1 = Album.builder()
            .title("Midnight Dreams")
            .artist("Aurora Sky")
            .imageUrl("https://picsum.photos/seed/album1/300/300")
            .releaseYear(2024)
            .genre("Pop")
            .likes(15000)
            .rating(4.5)
            .isFeatured(true)
            .build();

        Album album2 = Album.builder()
            .title("Electric Nights")
            .artist("Neon Pulse")
            .imageUrl("https://picsum.photos/seed/album2/300/300")
            .releaseYear(2024)
            .genre("Electronic")
            .likes(12000)
            .rating(4.7)
            .isFeatured(true)
            .build();

        Album album3 = Album.builder()
            .title("Soul Sessions")
            .artist("Jazz Collective")
            .imageUrl("https://picsum.photos/seed/album3/300/300")
            .releaseYear(2023)
            .genre("Jazz")
            .likes(8000)
            .rating(4.8)
            .isFeatured(false)
            .build();

        Album album4 = Album.builder()
            .title("Rock Legends")
            .artist("Thunder Strike")
            .imageUrl("https://picsum.photos/seed/album4/300/300")
            .releaseYear(2024)
            .genre("Rock")
            .likes(20000)
            .rating(4.6)
            .isFeatured(true)
            .build();

        Album album5 = Album.builder()
            .title("Hip Hop Vibes")
            .artist("Street Flow")
            .imageUrl("https://picsum.photos/seed/album5/300/300")
            .releaseYear(2024)
            .genre("Hip Hop")
            .likes(18000)
            .rating(4.4)
            .isFeatured(true)
            .build();

        albumRepository.saveAll(Arrays.asList(album1, album2, album3, album4, album5));

        // Add songs for each album
        List<Song> songs = Arrays.asList(
            Song.builder().title("Dream Away").artist("Aurora Sky").durationSeconds(245).trackNumber(1).plays(50000).album(album1).build(),
            Song.builder().title("Starlight").artist("Aurora Sky").durationSeconds(198).trackNumber(2).plays(45000).album(album1).build(),
            Song.builder().title("Moonlit Path").artist("Aurora Sky").durationSeconds(220).trackNumber(3).plays(38000).album(album1).build(),

            Song.builder().title("Neon Glow").artist("Neon Pulse").durationSeconds(210).trackNumber(1).plays(62000).album(album2).build(),
            Song.builder().title("Digital Love").artist("Neon Pulse").durationSeconds(185).trackNumber(2).plays(55000).album(album2).build(),
            Song.builder().title("Synth Wave").artist("Neon Pulse").durationSeconds(232).trackNumber(3).plays(48000).album(album2).build(),

            Song.builder().title("Blue Notes").artist("Jazz Collective").durationSeconds(310).trackNumber(1).plays(25000).album(album3).build(),
            Song.builder().title("Smooth Groove").artist("Jazz Collective").durationSeconds(285).trackNumber(2).plays(22000).album(album3).build(),

            Song.builder().title("Thunder Road").artist("Thunder Strike").durationSeconds(268).trackNumber(1).plays(75000).album(album4).build(),
            Song.builder().title("Electric Storm").artist("Thunder Strike").durationSeconds(295).trackNumber(2).plays(68000).album(album4).build(),

            Song.builder().title("Flow State").artist("Street Flow").durationSeconds(195).trackNumber(1).plays(82000).album(album5).build(),
            Song.builder().title("City Lights").artist("Street Flow").durationSeconds(208).trackNumber(2).plays(76000).album(album5).build()
        );

        songRepository.saveAll(songs);
    }
}
