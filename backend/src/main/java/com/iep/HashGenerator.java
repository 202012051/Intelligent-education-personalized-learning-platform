package com.iep;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String hash = encoder.encode("123456");
        System.out.println("HASH:" + hash);
    }
}
