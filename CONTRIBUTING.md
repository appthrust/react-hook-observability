# Questions and Answers

## Q: Why don't you put "use client" or "use server" in the top of each files?

To do this may cause a runtime error by duplicated directive. For example, see the issue [vercel/next.js#54655](https://github.com/vercel/next.js/issues/54655)

So library users must put the directive in the top of each files by themselves.
