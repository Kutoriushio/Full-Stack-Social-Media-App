import { ID, Query } from 'appwrite'

import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      )

      if (!newAccount) throw Error;

      const avatarUrl = avatars.getInitials(user.name);

      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl
      })

      return newUser

    } catch (error) {
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user: {
  accountId: string,
  email: string,
  name: string,
  username?: string,
  imageUrl: URL
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    )

    return newUser
    
  } catch (error) {
    console.log(error)
  }
  
}

export async function signInAccount(user:{
  email: string;
  password: string
}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error)
  }
}

export async function signOutAccount(){
  try {
    const session = await account.deleteSession('current');

    return session
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    // upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw Error

    // Get file url
    const fileUrl = getFileView(uploadedFile.$id)

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    // Conver tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
    
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file :File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFileView(fileId: string) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId,
    )

    if (!fileUrl) throw Error;

    return fileUrl
  } catch (error) {
    console.log(error)
  }

}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return{status: "ok"}
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error
    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )

    if (!savedPost) throw Error;

    return savedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedPostId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedPostId
    )

    if (!statusCode) throw Error;

    return {status: "ok"}
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId?: string) {
  if(!postId) throw Error;
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  try {
    const hasFileToUpdate = post.file.length > 0;
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    };

    if(hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFileView(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id};
    }

    // Conver tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags
      }
    )

    // Fail to update

    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      throw Error
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost
    
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({ pageParam }: {pageParam: number}) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if(pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error)
  }
}

export async function searchPosts(searchItem: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchItem)]
    );
      console.log("searched")
    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!statusCode) throw Error;
    
    await deleteFile(imageId);

    return {status: "ok"};
  } catch (error) {
    console.log(error)
  }
}

export async function getUsers(limit? :number) {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    )

    if(!users) throw Error;

    return users
  } catch (error) {
    console.log(error)
  }
}

// export async function getSavedPost() {
//   const savedPosts = await databases.listDocuments(
//    appwriteConfig.databaseId,
//    appwriteConfig.savesCollectionId,
//   )
//   return savedPosts
// }

export async function getUserById(userId: string) {
  if(!userId) throw Error;
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    if (!user) throw Error;

    return user
  } catch (error) {
    console.log(error)
  }
}

export async function updateUser(user: IUpdateUser) {
  try {
    const hasFileToUpdate = user.file.length > 0;
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId
    };

    if(hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFileView(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id};
    }


    // Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        username: user.username
      }
    )

    // Fail to update

    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId)
      }
      throw Error
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser
    
  } catch (error) {
    console.log(error)
  }
}

export async function getUserPosts(userId: string) {
  if(!userId) return
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if(!posts) throw Error;

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function followUser(followerId: string, followingId: string, followerArray: string[], followingArray: string[]) {
  try {
    const updateFollowed = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      followingId,
      {
        follower: followerArray
      }
    )

    if (!updateFollowed) throw Error

    const updateFollower = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      followerId,
      {
        following: followingArray
      }
    )

    if(!updateFollower) throw Error
    return ({status: "ok"})
  } catch (error) {
    console.log(error)
  }
}