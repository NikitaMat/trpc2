import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ 
      name: z.string().min(1), 
      email : z.string().email("Bitte geben sie eine gültige E-Mail ein"),
      age : z.number().int("Das Alter muss eine ganzzahl sein").min(12,"Das mindestalter ist 12")
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create(
        {
          data : {
            name : input.name,
            email : input.email,
            age: input.age
          }
        }
      );
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      orderBy: { name: "desc" },
    });

    return user ?? null;
  }),
});
