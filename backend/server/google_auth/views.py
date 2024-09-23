from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return JsonResponse({"error": "Token is required"}, status=400)

    # Verify the token with Google
    try:
        response = requests.get(
            f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}'
        )
        
        if response.status_code != 200:
            return JsonResponse({"error": "Invalid token"}, status=400)

        user_info = response.json()

        # Confirm successful authentication by checking for email
        if 'email' not in user_info:
            return JsonResponse({"error": "Token does not contain email"}, status=400)

        # Get or create the user in the local database
        user, created = User.objects.get_or_create(
            email=user_info['email'], 
            defaults={
                'name': user_info['name'],
                'phone_number': user_info.get('phone_number', '')
            }
        )

        # Generate JWT tokens for the authenticated user
        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            "message": "Authentication successful",
            "user_info": {
                'email': user.email,
                'name': user.name,
                'phone_number': user.phone_number
            },
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
