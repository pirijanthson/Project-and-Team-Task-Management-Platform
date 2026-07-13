const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();


async function main() {

    const hashedPassword = await bcrypt.hash(
        "Admin@123",
        10
    );


    const admin = await prisma.user.create({

        data: {

            fullName: "System Administrator",

            email: "admin@gmail.com",

            password: hashedPassword,

            role: "ADMIN"

        }

    });


    console.log("Admin created:", admin);

}


main()
.then(async()=>{

    await prisma.$disconnect();

})
.catch(async(error)=>{

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);

});