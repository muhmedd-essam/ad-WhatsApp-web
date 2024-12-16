<form action="/send-whatsapp-message" method="POST">
    @csrf
    <div>
        <label for="number">أدخل رقم الواتساب:</label>
        <input type="text" id="number" name="number" placeholder="201234567890" required>
    </div>
    <div>
        <label for="message">الرسالة:</label>
        <textarea id="message" name="message" placeholder="اكتب رسالتك هنا" required></textarea>
    </div>
    <button type="submit">إرسال الرسالة</button>
</form>
