import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-12 text-center max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Product Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We couldn't find the product you were looking for. It might have
            been removed or the link is incorrect.
          </p>
          <Button onClick={() => navigate("/")}>Return to Homepage</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductNotFound;
