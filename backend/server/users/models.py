from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    """
    Custom manager for User model that handles creating regular and super users.
    """

    def create_user(self, email, name, phone_number, password=None):
        """
        Creates and returns a regular user with the given email, name, and phone number.

        Args:
            email (str): The user's email address.
            name (str): The user's name.
            phone_number (str): The user's phone number.
            password (str, optional): The user's password. Defaults to None.

        Raises:
            ValueError: If email or phone number is not provided.

        Returns:
            User: The created user instance.
        """
        if not email:
            raise ValueError("Users must have an email address")
        if not phone_number:
            raise ValueError("Users must have a phone number")
        
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, phone_number, password):
        """
        Creates and returns a superuser with the given email, name, phone number, and password.

        Args:
            email (str): The superuser's email address.
            name (str): The superuser's name.
            phone_number (str): The superuser's phone number.
            password (str, optional): The superuser's password. Defaults to None.

        Returns:
            User: The created superuser instance.
        """
        user = self.create_user(email, name, phone_number, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
    Custom user model where authentication is based on email instead of username.

    Attributes:
        name (str): The user's full name.
        email (str): The user's email, used for authentication.
        phone_number (str): The user's phone number.
        date_joined (datetime): The date and time when the user joined.
        posts_created (ManyToManyField): Posts created by the user.
        posts_replied_to (ManyToManyField): Posts the user has replied to.
        is_active (bool): Whether the user account is active.
        is_admin (bool): Whether the user has admin rights.
    """
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # posts_created = models.ManyToManyField('Post', related_name='created_by', blank=True)
    # posts_replied_to = models.ManyToManyField('Post', related_name='replied_by', blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def __str__(self):
        """
        Returns a string representation of the user, which is their name.

        Returns:
            str: The name of the user.
        """
        return self.name
    
        # Required methods
    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        return True  # Simplistic permissions logic; customize as needed

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        return True  # Simplistic permissions logic; customize as needed
    
    @property
    def is_staff(self):
        """
        Checks if the user is an admin (staff member).

        Returns:
            bool: True if the user is an admin, False otherwise.
        """
        return self.is_admin

    class Meta:
        """
        Meta options for the User model.

        Attributes:
            verbose_name (str): The singular name of the model.
            verbose_name_plural (str): The plural name of the model.
        """
        verbose_name = 'User'
        verbose_name_plural = 'Users'