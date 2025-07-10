import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

  
// define the http router
const http = httpRouter()

export const clerkUsersWebhook = httpAction(async (ctx, request) => {
    const {data, type} = await request.json();
    console.log(data);

    switch (type) {
        case "user.created":
            await ctx.runMutation(internal.users.createUser, {  
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                imageUrl: data.image_url,
                followersCount: 0,
            });
            break;
        case "user.updated":
            console.log("user updated");
            break;
    }
    return new Response(null, { status: 200 })
})
  
  // define the webhook route
http.route({
    path: '/clerk-users-webhook',
    method: 'POST',
    handler: clerkUsersWebhook,
})

// https://cheery-dove-46.convex.site/clerk-users-webhook
export default http;