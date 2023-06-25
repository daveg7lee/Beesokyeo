import openai

OPENAI_API_KEY = "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"

# openai API 키 인증
openai.api_key = OPENAI_API_KEY


def ai_answer():
    model = "gpt-3.5-turbo"
    query = input("user: ")
    messages = [
        {"role": "user", "content": query},
    ]

    response = openai.ChatCompletion.create(model=model, messages=messages)
    answer = response["choices"][0]["message"]["content"]
    return answer


def repeat():
    answer = ai_answer()
    print(f"AI : {answer}")
    ai_answer()


repeat()
