from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    class Roles(models.TextChoices):
        HR = "HR", "HR"
        EMPLOYEE = "EMPLOYEE", "Employee"

    class Departments(models.TextChoices):
        ENGINEERING = "engineering", "Engineering"
        MARKETING = "marketing", "Marketing"
        SALES = "sales", "Sales"
        HR = "hr", "Human Resources"
        FINANCE = "finance", "Finance"
        OPERATIONS = "operations", "Operations"
        DESIGN = "design", "Design"
        PRODUCT = "product", "Product"
        OTHER = "other", "Other"

    username = None  # remove username
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=16, choices=Roles.choices, default=Roles.HR)
    department = models.CharField(max_length=32, choices=Departments.choices, blank=True)
    
    phone = models.CharField(max_length=20, blank=True)  
    location = models.CharField(max_length=100, blank=True)  
    bio = models.TextField(blank=True)  
    join_date = models.DateField(auto_now_add=True)  # date user created  

    GENDERS = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
        ("prefer_not_to_say", "Prefer not to say"),
    ]
    MARITAL_STATUSES = [
        ("single", "Single"),
        ("married", "Married"),
        ("divorced", "Divorced"),
        ("widowed", "Widowed"),
        ("other", "Other"),
    ]

    gender = models.CharField(max_length=20, choices=GENDERS, default="other", blank=True)
    date_of_birth = models.DateField(null=True, blank=True)  # keep blank for today
    nationality = models.CharField(max_length=50, blank=True, default="Other")
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUSES, default="other", blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"

class Invite(models.Model):
    """
    HR creates an invite for an employee. Employee completes signup via token.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    department = models.CharField(max_length=32, choices=User.Departments.choices, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_invites")
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invite({self.email}) accepted={self.is_accepted}"
