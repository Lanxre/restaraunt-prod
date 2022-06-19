from .models import *
from .database import Database
from abc import ABC, abstractmethod

class CartRepository(ABC):
    @abstractmethod
    def add_to_cart(self, user_id: int, dishes: Product):
        pass

    @abstractmethod
    def update_user_cart(self, **kwargs):
        pass



class Cart(CartRepository):
    def __init__(self, database: Database):
        try:
            self._db = database
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')

    def add_to_cart(self, user_id: int, dishes: Product):
        try:
            self._db.cursor.execute("INSERT INTO CART (user_id, dish_id, dish_type, price, quantity, status) VALUES (?, ?, ?, ?, ?, ?)",
                                    (user_id, dishes.dish_id, dishes.dish_type, dishes.price, dishes.quantity, dishes.status))
            self._db.conn.commit()
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
    
    def update_user_cart(self, **kwargs):
        try:
            self._db.cursor.execute("UPDATE CART SET quantity = ?, status = ? WHERE user_id = ? AND dish_id = ?",
                                    (kwargs.get('quantity'), kwargs.get('status'), kwargs.get('user_id'), kwargs.get('dish_id')))
            self._db.conn.commit()
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
    

    def clear_cart(self, user_id: int):
        try:
            self._db.cursor.execute("DELETE FROM CART WHERE user_id = ?", (user_id,))
            self._db.conn.commit()
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
    

    def get_success_cart(self, user_id: int) -> list[Product]:
        try:
            self._db.cursor.execute("SELECT * FROM CART WHERE user_id = ? AND status = ?", (user_id, 1))
            return list(map(lambda x: Product(
                dish_id=x[2],
                dish_type=x[3],
                price=x[4],
                quantity=x[5],
                status=x[6]
            ), self._db.cursor.fetchall()))
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
    


        
