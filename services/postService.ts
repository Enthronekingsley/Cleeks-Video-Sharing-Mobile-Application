import {uploadFile} from "@/services/imageService";
import {supabase} from "@/lib/supabase";

type Props = {
    limit: number;
    userId?: any;
}

export const createOrUpdatePost = async (post: any) => {
    try {
        if (post.file && typeof post.file == "object") {
            let isImage = post?.file?.type == "image";
            let folderName = isImage? "postImages": "postVideos";
            let fileRsult = await uploadFile(folderName, post?.file?.uri, isImage);
            if (fileRsult.success) post.file = fileRsult.data;
            else {
                return fileRsult;
            }
        }
            const {data, error} = await supabase
                .from("posts")
                .upsert(post)
                .select()
                .single();

        if (error) {
            console.log("Create post error: ", error);
            return {success: false, msg: "Could not create your post"}
        }
        return {success: true, data: data}
    }catch (error) {
        console.log("CreatePost error: ", error);
        return {success: false, msg: "Could not create your post"}
    }
};

export const fetchPosts = async (limit = 10, userId?: number) => {
    try {
        if (userId) {
            const {data, error} = await supabase
                .from("posts")
                .select(`
            *,
            users: users (id, name, image),
            postLikes (*),
            comments (count)
            `)
                .order("created_at", {ascending: false})
                .eq("userId", userId)
                .limit(limit);

            if (error) {
                console.log("fetchPosts error: ", error);
                return {success: false, msg: "Could not fetch the posts"}
            }

            return {success: true, data: data}
        }else {
            const {data, error} = await supabase
                .from("posts")
                .select(`
            *,
            users: users (id, name, image),
            postLikes (*),
            comments (count)
            `)
                .order("created_at", {ascending: false})
                .limit(limit);

            if (error) {
                console.log("fetchPosts error: ", error);
                return {success: false, msg: "Could not fetch the posts"}
            }

            return {success: true, data: data}
        }
    }catch (error) {
        console.log("fetchPosts error: ", error);
        return {success: false, msg: "Could not fetch the posts"}
    }
};

export const createPostLike = async (postLike: any) => {
    try {
        const {data, error} = await supabase
            .from("postLikes")
            .insert(postLike)
            .select()
            .single();

        if (error) {
            console.log("postLike error: ", error);
            return {success: false, msg: "Could not like the post"}
        }

        return {success: true, data: data}
    }catch (error) {
        console.log("fetchPost error: ", error);
        return {success: false, msg: "Could not like the post"}
    }
};

export const removePostLike = async (postId: any, userId: any) => {
    try {
        const {error} = await supabase
            .from("postLikes")
            .delete()
            .eq("userId", userId)
            .eq("postId", postId)
        if (error) {
            console.log("postLike error: ", error)
            return {success: false, msg: "Could not remove the post like"}
        }
        return {success: true}
    }catch (error) {
        console.log("postLike error: ", error)
        return {success: false, msg: "Could not remove the post like"}
    }
};

export const fetchPostDetails = async (postId: any) => {
    try {
        const {data, error} = await supabase
            .from("posts")
            .select(`
            *,
            users: users (id, name, image),
            postLikes (*),
            comments (*, user: users(id, name, image))
            `)
            .eq("id", postId)
            .order("created_at", {ascending: false, foreignTable: "comments"})
            .single();

        if (error) {
            console.log("fetchPostDetails error: ", error);
            return {success: false, msg: "Could not fetch the post"}
        }

        return {success: true, data: data}
    }catch (error) {
        console.log("fetchPostDetails error: ", error);
        return {success: false, msg: "Could not fetch the post"}
    }
};

export const createComment = async (comment: any) => {
    try {
        const {data, error} = await supabase
            .from("comments")
            .insert(comment)
            .select()
            .single();

        if (error) {
            console.log("comment error: ", error);
            return {success: false, msg: "Could not create your comment"}
        }

        return {success: true, data: data}
    }catch (error) {
        console.log("comment error: ", error);
        return {success: false, msg: "Could not create your comment"}
    }
};

export const removeComment = async (commentId: any) => {
    try {
        const {error} = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId)
        if (error) {
            console.log("removeComment error: ", error);
            return {success: false, msg: "Could not remove the comment"}
        }

        return {success: true, data: {commentId}}
    }catch (error) {
        console.log("removeComment error: ", error);
        return {success: false, msg: "Could not remove the comment"}
    }
};


export const removePost = async (postId: any) => {
    try {
        const {error} = await supabase
            .from("posts")
            .delete()
            .eq("id", postId)
        if (error) {
            console.log("removePost error: ", error);
            return {success: false, msg: "Could not remove the post"}
        }

        return {success: true, data: {postId}}
    }catch (error) {
        console.log("removePost error: ", error);
        return {success: false, msg: "Could not remove the post"}
    }
};
