import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const defaultPassword = "Password123!";

async function main() {
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.tweet.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.user.create({
        data: {
          email: `user${index + 1}@example.com`,
          username: `user${index + 1}`,
          displayName: faker.person.fullName(),
          passwordHash,
          bio: faker.lorem.sentence({ min: 6, max: 14 }),
          avatarUrl: `https://api.dicebear.com/9.x/identicon/svg?seed=user-${index + 1}`,
        },
      }),
    ),
  );

  const tweets = [];

  for (const user of users) {
    const createdTweets = await Promise.all(
      Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).map(() =>
        prisma.tweet.create({
          data: {
            authorId: user.id,
            content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })).slice(0, 280),
          },
        }),
      ),
    );

    tweets.push(...createdTweets);
  }

  for (const user of users) {
    const candidates = users.filter((candidate) => candidate.id !== user.id);
    const shuffled = faker.helpers.shuffle(candidates).slice(0, 4);

    await Promise.all(
      shuffled.map((target) =>
        prisma.follow.create({
          data: {
            followerId: user.id,
            followingId: target.id,
          },
        }),
      ),
    );
  }

  for (const tweet of tweets) {
    const likers = faker.helpers.shuffle(users).slice(0, faker.number.int({ min: 0, max: 5 }));

    await Promise.all(
      likers.map((user) =>
        prisma.like.create({
          data: {
            userId: user.id,
            tweetId: tweet.id,
          },
        }),
      ),
    );
  }

  console.log("Seed completed");
  console.log(`Example login: user1@example.com / ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
