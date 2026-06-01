package com.iep.module01_user.mapper;

import com.iep.module01_user.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM user WHERE email = #{email}")
    User findByEmail(@Param("email") String email);

    @Insert("INSERT INTO user (email, password_hash, nickname, role) VALUES (#{email}, #{passwordHash}, #{nickname}, #{role})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Select("SELECT * FROM user WHERE id = #{id}")
    User findById(@Param("id") Long id);

    @Update("UPDATE user SET nickname = #{nickname}, avatar_url = #{avatarUrl} WHERE id = #{id}")
    int updateProfile(@Param("id") Long id, @Param("nickname") String nickname, @Param("avatarUrl") String avatarUrl);
}
