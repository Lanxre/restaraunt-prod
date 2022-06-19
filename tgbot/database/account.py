from .models import *
from .database import Database
from abc import ABC, abstractmethod

class Specification(ABC):
    
    @property
    @abstractmethod
    def is_satisfied_user(self) -> bool:
        pass


class AccountRepository(ABC):
    
    @abstractmethod
    def get_user_account(self, specification: Specification) -> TGUSERS:
        pass

    @abstractmethod
    def create_user_account(self, specification: Specification) -> TGUSERS:
        pass

    @abstractmethod
    def update_user_account(self, specification: Specification) -> TGUSERS:
        pass



class AccountSpecification(Specification):
    
    def __init__(self, **kwargs):
        self.kwargs = kwargs

    @property
    def is_satisfied_user(self) -> int:
        return self.kwargs
        


class AccountWorkRepository(AccountRepository):
    
    def __init__(self, database: Database):
        try:
            self._db = database
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
            

    def __enter__(self):
        return self


    def get_user_account(self, specification: Specification) -> TGUSERS:
        try:
            user_id = specification.is_satisfied_user.get('user_id', None)
            if user_id is None:
                raise ValueError('Не указан идентификатор пользователя')
            else:
                user = self._db.cursor.execute("SELECT * FROM TGUSERS WHERE id = ?", 
                (user_id,)).fetchone()
                 
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
        
        
        
        return TGUSERS(*user) if user else None


    def create_user_account(self, specification: Specification) -> bool:
        try:
            user_data: dict = {
                'id' : specification.is_satisfied_user.get('user_id', None),
                'first_name' : specification.is_satisfied_user.get('first_name', None),
                'last_name' : specification.is_satisfied_user.get('last_name', None),
                'token' : specification.is_satisfied_user.get('token', None),
                'account_uses' : specification.is_satisfied_user.get('account_uses', 0)
            }
            if user_data['id'] is None:
                raise ValueError('Не указан идентификатор пользователя')
            
            else:
                self._db.cursor.execute("INSERT INTO TGUSERS (id, first_name, last_name, token, account_uses) VALUES (?, ?, ?, ?, ?)", 
                (user_data['id'], user_data['first_name'], user_data['last_name'], user_data['token'], user_data['account_uses']))
                self._db.conn.commit()
                 
        except Exception:
            return False
        
        
        
        return True

    
    def update_user_account(self, specification: Specification) -> bool:
        try:
            prefer_user = self.get_user_account(specification)
            user_data: dict = {
                'id' : specification.is_satisfied_user.get('user_id', prefer_user.id),
                'first_name' : specification.is_satisfied_user.get('first_name', prefer_user.first_name),
                'last_name' : specification.is_satisfied_user.get('last_name', prefer_user.last_name),
                'token' : specification.is_satisfied_user.get('token', prefer_user.token),
                'account_uses' : specification.is_satisfied_user.get('account_uses', prefer_user.account_uses)
            }

            if user_data['id'] is None:
                raise ValueError('Не указан идентификатор пользователя')
            
            else:
                self._db.cursor.execute("UPDATE TGUSERS SET first_name = ?, last_name = ?, token = ?, account_uses = ? WHERE id = ?", 
                (user_data['first_name'], user_data['last_name'], user_data['token'], user_data['account_uses'], user_data['id']))
                self._db.conn.commit()
                 
        except Exception as e:
            raise ValueError(f'Ошибка базы данных: {e}')
        
        
        
        return bool(True)


class AccountController:
    def __init__(self, repos: AccountRepository):
        self._repo = repos
    
    def get_user_account(self, user_id: int) -> TGUSERS:
        user = self._repo.get_user_account(AccountSpecification(user_id=user_id))
        return user
    
    def create_user_account(self, **kwargs) -> bool:
        return self._repo.create_user_account(AccountSpecification(**kwargs))

    def update_user_account(self, **kwargs) -> bool:
        return self._repo.update_user_account(AccountSpecification(**kwargs))
    
    def logout(self, user_id: int):
        self._repo.update_user_account(AccountSpecification(user_id=user_id, 
                                                            token=None,
                                                            account_uses=0))

    def get_token(self, user_id: int) -> str:
        user = self._repo.get_user_account(AccountSpecification(user_id=user_id))
        return user.token
    



    def __enter__(self):
        return self
    

class Account:
    def __init__(self, db: Database):
        self.db = db
    

    def create_blank_account(self, user: TGUSERS):
        self.db.cursor.execute("INSERT INTO TGUSERS VALUES (?, ?, ?, ?, ?)", (user.id, user.first_name, user.last_name, None, 0))
        self.db.conn.commit()
        return self


    def update_blank_account(self, user_id: int, token: str):
        self._set_token(user_id, token)
        self._set_account_uses(user_id)
        return self


    def _set_token(self, user_id: int, token: str):
        self.db.cursor.execute("UPDATE TGUSERS SET token = ? WHERE id = ?", (token, user_id))
        self.db.conn.commit()
        return self

    def _set_account_uses(self,user_id: int):
        self.db.cursor.execute("UPDATE TGUSERS SET account_uses = ? WHERE id = ?", (1, user_id))
        self.db.conn.commit()
        return self

    def _disable_account_uses(self, user_id: int):
        self.db.cursor.execute("UPDATE TGUSERS SET account_uses = ? WHERE id = ?", (0, user_id))
        self.db.conn.commit()
        return self

    def get_user(self, user_id: int ) -> TGUSERS:
        user = self.db.cursor.execute("SELECT * FROM TGUSERS WHERE id = ?", (user_id,)).fetchone()
        
        if user:
            return TGUSERS(*user)
        
        return None

    def is_not_account(self, user_id: int) -> bool:
        user = self.get_user(user_id)
        if user is None:
            return bool(user)
        
        return bool(user)

    def is_not_success_account(self, user_id: int) -> bool:
        user = self.db.cursor.execute("SELECT * FROM TGUSERS WHERE id = ? AND token = ? AND account_uses = ?",
        (user_id, None, None)).fetchone()
        if user:
            return bool(user)

        return bool(user)
        
    
    def is_auth(self, user_id: int) -> bool:
        user = self.get_user(user_id)
        if user is not None:
            return bool(user.token)
            
        return False


    def logout(self, user_id: int):
        user = self.get_user(user_id)
        
        if user.token:
            self._set_token(user_id, None)
            self._disable_account_uses(user_id)
            
    def get_token(self, user_id: int) -> str:
        user = self.get_user(user_id)
        return user.token


