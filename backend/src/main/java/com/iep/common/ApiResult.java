package com.iep.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResult<T> {
    private int code;
    private String message;
    private T data;
    private long timestamp;

    private ApiResult(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> ApiResult<T> success(T data) {
        return new ApiResult<>(200, "success", data);
    }

    public static <T> ApiResult<T> success(String message, T data) {
        return new ApiResult<>(200, message, data);
    }

    public static <T> ApiResult<T> error(int code, String message) {
        return new ApiResult<>(code, message, null);
    }

    public static <T> ApiResult<T> badRequest(String message) {
        return new ApiResult<>(400, message, null);
    }

    public static <T> ApiResult<T> unauthorized(String message) {
        return new ApiResult<>(401, message, null);
    }

    public static <T> ApiResult<T> forbidden(String message) {
        return new ApiResult<>(403, message, null);
    }

    public static <T> ApiResult<T> notFound(String message) {
        return new ApiResult<>(404, message, null);
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public long getTimestamp() { return timestamp; }
}
