import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "@/convex/users";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

export const addThreadMessage = mutation({
    args: {
        content: v.string(),
        mediaFiles: v.optional(v.array(v.string())),
        websiteUrl: v.optional(v.string()),
        threadId: v.optional(v.id('messages')),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);

        return await ctx.db.insert('messages', {
            ...args,
            userId: user._id,
            likeCount: 0,
            commentCount: 0,
            retweetCount: 0,
        });

        if (args.threadId) {
            // await ctx.db.patch(args.threadId, {
            //     lastMessageId: messageId,
            // });
        }
    }
});

export const getThreads = query({
    args: {
        paginationOpts: paginationOptsValidator,
        userId: v.optional(v.id('users')),
    },
    handler: async (ctx, args) => {
        let threads;

        if (args.userId) {
            threads = await ctx.db
            .query('messages')
            .filter((q) => q.eq(q.field('userId'), args.userId))
            .order('desc')
            .paginate(args.paginationOpts);
        } else {
            threads = await ctx.db
            .query('messages')
            .filter((q) => q.eq(q.field('threadId'), undefined))
            .order('desc')
            .paginate(args.paginationOpts);
        }

        const messagesWithCreator = await Promise.all(threads.page.map(async (message) => {
            const creator = await getMessagesCreator(ctx, message.userId);
            const mediaUrls = await getMediaUrls(ctx, message.mediaFiles);
            
            return { ...message, creator, mediaFiles: mediaUrls };
        }));

        return {
            ...threads,
            page: messagesWithCreator,
        }
    }
});

const getMessagesCreator = async (ctx: QueryCtx, userId: Id<'users'>) => {
    const user = await ctx.db.get(userId);

    if (!user?.imageUrl || user.imageUrl.startsWith('https://')) {
        return user;
    }

    const imageUrl = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return { ...user, imageUrl };
}

const getMediaUrls = async (ctx: QueryCtx, mediaFiles: string[] | undefined) => {
    if (!mediaFiles || mediaFiles.length === 0) return [];

    const mediaUrls = await Promise.all(mediaFiles.map(async (mediaFile) => {
        let url : any = mediaFile;

        if (mediaFile.startsWith('https://')) {
            url = mediaFile;
        } else {
            url = await ctx.storage.getUrl(mediaFile as Id<'_storage'>);
        }
        
        return url;
    }));
    return mediaUrls;
}

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);
  
    return await ctx.storage.generateUploadUrl();
  }});