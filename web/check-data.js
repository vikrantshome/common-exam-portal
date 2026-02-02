const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config()

const dbPath = path.join(__dirname, 'dev.db')
console.log('DB Path:', dbPath)

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
})

async function main() {
  try {
    const exams = await prisma.exam.findMany()
    console.log('Exams found:', exams.length)
    console.log(JSON.stringify(exams, null, 2))
    
    const today = new Date()
    console.log('Today:', today)
    
    const upcoming = await prisma.exam.findMany({
      where: {
        regEndDate: {
          gte: today
        }
      }
    })
    console.log('Upcoming found:', upcoming.length)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
