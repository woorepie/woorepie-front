const QNAPage = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">고객 문의</h1>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium">
                이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border rounded-md"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-md"
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="subject" className="block mb-2 font-medium">
                제목
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 border rounded-md"
                placeholder="제목을 입력하세요"
                required
              />
            </div>
  
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-medium">
                문의 내용
              </label>
              <textarea
                id="message"
                className="w-full p-3 border rounded-md h-40"
                placeholder="문의 내용을 입력하세요"
                required
              ></textarea>
            </div>
  
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              문의하기
            </button>
          </form>
        </div>
      </div>
    )
  }
  
  export default QNAPage
  