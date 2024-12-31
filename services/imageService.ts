import * as FileSystem from 'expo-file-system';
import {supabaseUrl} from "@/lib/supabaseAPI";
import {decode} from "base64-arraybuffer";
import {supabase} from "@/lib/supabase";

export const getUserImageSrc = (imagePath : any) => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath);
    }else {
        return require("@/assets/images/defaultUser.png")
    }
}

export const downloadFile = async (url: any) => {
    try {
        const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
        return uri;
    }catch (error: any) {
        return null
    }
}

export const getLocalFilePath = (filePath: any) => {
    let fileName = filePath.split("/").pop();
    return `${FileSystem.documentDirectory}${fileName}`
}

export const getSupabaseFileUrl = (filePath: string) =>{
    if (filePath) {
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
    return null
}

export const uploadFile = async (folderName: any, fileUri: any, isImage: any) => {
    try {
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });
        let imageData = decode(fileBase64);
        let {data, error} = await supabase
            .storage
            .from('uploads')
            .upload(fileName, imageData, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage? "image/*": "video/*"
            })
        if (error) {
            console.log("File upload error: ", error);
            return {succes: false, msg: "Could not upload media"}
        }

        return {success: true, data: data?.path}
    }catch (error) {
        console.log("File upload error: ", error);
        return {succes: false, msg: "Could not upload media"}
    }
}

export const getFilePath = (folderName: any, isImage: any) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage? ".png" : ".mp4"}`
}