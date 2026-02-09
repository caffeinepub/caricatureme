import Nat8 "mo:core/Nat8";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  let codeErrorReadingFile = 442;
  let codeSuccess = 200;

  type SuccessResponse = {
    response : {
      data : ResponseData;
    };
    status_code : Nat16;
  };

  type Fallback = {
    message : Text;
    status_code : Nat16;
  };

  type ResponseData = {
    base_64_image : ?Blob;
  };

  public type ErrorResponse = {
    fallback : Fallback;
    status_code : Nat16;
  };
};
