export async function POST(req: Request) {
  const body = await req.json(); // body = ReadableStream

  // 전송받은 데이터 유효성 검사
  if (!bodySchema.isValidSync(body)) {
    return new Response(JSON.stringify({ message: '메일 전송에 실패함' }), {
      status: 400,
    });
  }

  // Nodemailer 이메일 전송 로직
  return sendEmail(body)
    .then(
      () =>
        new Response(JSON.stringify({ message: '메일을 성공적으로 보냈음' }), {
          status: 200,
        })
    )
    .catch((error) => {
      console.error(error);

      return new Response(JSON.stringify({ message: '메일 전송에 실패함' }), {
        status: 500,
      });
    });
}