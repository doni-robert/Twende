
from django.urls import path
from .views import PostListCreateView

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),  # For listing and creating posts
    # path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),   # For retrieving, updating, or deleting a specific post
]