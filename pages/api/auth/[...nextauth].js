import NextAuth from 'next-auth'
// This is a placeholder NextAuth config. Replace providers & DB as needed.
export default NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) { return session }
  }
})
