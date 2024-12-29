package com.NextCoreInv.book_network.file;

import com.NextCoreInv.book_network.book.Book;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;
import static java.lang.System.currentTimeMillis;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {
    @Value("${application.file.upload.photos-output-path}")
    private String fileUploadingPath;


    public String saveFile(
            @NotNull  MultipartFile sourceFile,
            @NotNull  Integer userId) {

            final String fileUploadSubPath = "users"+ separator + userId;
            return uploadFile(sourceFile,fileUploadSubPath);

    }

    private String uploadFile(
            @NotNull MultipartFile sourceFile,
            @NotNull String fileUploadSubPath
    ) {
        final String finalUploadingPath = fileUploadingPath + separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadingPath);
        if(!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if(!folderCreated) {
                log.warn("Could not create folder " + targetFolder.getAbsolutePath());
                return null;

            }
        }
        final String fileExtension =getFileExtention(sourceFile.getOriginalFilename());

        String targetFilePath = finalUploadingPath + separator + currentTimeMillis() + "."+ fileExtension;
        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath,sourceFile.getBytes());
            log.info("File saved to " + targetFilePath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("File wa snot saved to " + targetFilePath+"/n"+e.getMessage());
        }
        return null;
    }

    private String getFileExtention(String filename) {
        if(filename==null||filename.isEmpty()){
            return null;
        }
        int lastIndex = filename.lastIndexOf(".");
        if(lastIndex==-1){
            return "";
        }
        return filename.substring(lastIndex+1).toLowerCase();
    }
}
