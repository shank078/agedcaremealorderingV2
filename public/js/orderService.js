// orderService.js

const OrderService = {

    async getOrder(mealDate, mealType, roomNumber) {

        const docId = `${mealDate}_${mealType}`;

        const docRef = db.collection("orders")
            .doc(docId)
            .collection("rooms")
            .doc(roomNumber);

        return await docRef.get();
    },

    async saveOrder(mealDate, mealType, roomNumber, orderData) {

        const docId = `${mealDate}_${mealType}`;

        return await db.collection("orders")
            .doc(docId)
            .collection("rooms")
            .doc(roomNumber)
            .set({
                ...orderData,
                timestamp: new Date()
            });
    }

};